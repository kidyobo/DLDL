using System;
using System.Collections.Generic;
using System.Text;
using EnvDTE;
using EnvDTE80;
using System.Xml;
using System.Reflection;
using System.IO;
using System.Text.RegularExpressions;

namespace Stripem
{
    //public sealed partial class Connect
    //{
    //	private static DocumentEvents _de = null;
    //	private static _dispDocumentEvents_DocumentSavedEventHandler _deSavedEvent = null;

    //	/// <summary>begin tracking solution events</summary>
    //	private void TrackDocumentEvents()
    //	{
    //		//start tracking solution events
    //		if (_de == null)
    //		{
    //			_de = _applicationObject.Events.get_DocumentEvents(null);
    //		}
    //		if (_deSavedEvent == null)
    //		{
    //			_deSavedEvent = new _dispDocumentEvents_DocumentSavedEventHandler(de_SavedEvent);
    //			_de.DocumentSaved += _deSavedEvent;
    //		}
    //	}

    //	/// <summary>remove solution event handlers</summary>
    //	private void ReleaseDocumentEvents()
    //	{
    //		//stop tracking solution events
    //		if (_de != null)
    //		{                
    //			try
    //			{  
    //				if (_deSavedEvent != null)
    //				{                       
    //					_de.DocumentSaved -= de_SavedEvent; 
    //					_deSavedEvent = null; 
    //				}    
    //			}      
    //			catch 
    //			{ 
    //			} 
    //			_de = null; 
    //		}      
    //	}      

    //	/// <summary>File saved in the editor</summary>        
    //	private void de_SavedEvent(Document doc)   
    //	{
    //		if (_style == StripemOptions.EolStyle.Disabled || doc == null) 
    //			return;

    //		//StringHelperTest.HiPerfTimer perfTimer;    
    //		//perfTimer = new StringHelperTest.HiPerfTimer();   
    //		//GC.Collect();        
    //		//perfTimer.Start();

    //		// If filename filter is enabled
    //		if (_enableFilenameFilter)
    //		{
    //			// Check if the file name matches the filename filter
    //			//System.Windows.Forms.MessageBox.Show(doc.Name + " match " + _filenameFilter + " = " + Regex.IsMatch(doc.Name, _filenameFilter), "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);
    //			if (!Regex.IsMatch(doc.Name, _filenameFilter))
    //				return;
    //		}

    //		StreamReader reader = new StreamReader(doc.FullName); 
    //		string content = reader.ReadToEnd();

    //		// Don't convert Unicode files
    //		if (reader.CurrentEncoding.GetType() == System.Text.Encoding.Unicode.GetType() ||    
    //			reader.CurrentEncoding.GetType() == System.Text.Encoding.UTF32.GetType() ||        
    //			reader.CurrentEncoding.GetType() == System.Text.Encoding.BigEndianUnicode.GetType())  
    //		{             
    //			//System.Windows.Forms.MessageBox.Show("Strip'em doesn't support " + reader.CurrentEncoding.EncodingName + " file encoding.", "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);      
    //			reader.Close();    
    //			return;           
    //		}
    //		reader.Close();

    //		char[] buffer = null;      
    //		int length = 0;
    //		int start = 0;
    //		int count = 0;

    //		switch (_style)
    //		{
    //			case StripemOptions.EolStyle.Unix:
    //				length = ConvertToUnix(content, out buffer, out count);
    //				break;
    //			case StripemOptions.EolStyle.Windows:
    //				length = ConvertToWindows(content, out buffer, out count);
    //				break;
    //			case StripemOptions.EolStyle.Mac:
    //				length = ConvertToMac(content, out buffer, out start, out count);
    //				break;
    //		}

    //		if (length > 0)
    //		{
    //			StreamWriter writer = new StreamWriter(doc.FullName);
    //			writer.Write(buffer, start, length);
    //			writer.Close();
    //		}

    //		//perfTimer.Stop();
    //		//string message = "Replaced " + count + " in: " + perfTimer.Duration * 1000 + "ms";
    //		//System.Windows.Forms.MessageBox.Show(message, "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
    //	}

    //	/// <summary>Convert the file to Unix format</summary>
    //	/// <param name="content">The source string</param>
    //	/// <param name="buffer">Returns the converted string</param>
    //	/// <param name="count">Returns the number of EOL characters that were converted</param>
    //	/// <returns>Length of the output <paramref name="buffer">buffer</paramref> parameter (0 if failed to convert)</returns>
    //	private int ConvertToUnix(string content, out char[] buffer, out int count)
    //	{
    //		count = 0;
    //		int iFirst = content.IndexOf('\r');
    //		if (iFirst == -1)
    //		{
    //			// Always append a newline at the end of the file
    //			if (!content.EndsWith("\n"))
    //			{
    //				content += "\n";
    //				buffer = content.ToCharArray();
    //				return buffer.Length;
    //			}
    //			buffer = null;
    //			return 0;
    //		}

    //		buffer = content.ToCharArray();

    //		int iDst, iSrc;
    //		int size = buffer.Length;
    //		for (iDst = iSrc = iFirst; iSrc < size; iDst++, iSrc++)
    //		{
    //			if (buffer[iSrc] == '\r')
    //			{
    //				// "\r\n"     -> "\n"
    //				// "\r\r\r\n" -> "\n\n\n"

    //				// Replace consecutive /r with /n
    //				for (; iSrc < size && buffer[iSrc] == '\r'; iSrc++, iDst++)
    //				{
    //					buffer[iDst] = '\n';
    //					count++;
    //				}
    //				// iDst increases again in the external loop
    //				iDst--;

    //				// If it's Windows format (\r..\r\n), then skip the \n,
    //				// (iSrc increases in the external loop. In Windows iSrc is increased twice to skip the \n)
    //				if (buffer[iSrc] != '\n')
    //					iSrc--;
    //			}
    //			else
    //			{
    //				buffer[iDst] = buffer[iSrc];
    //			}
    //		}

    //		// Always append a newline at the end of the file
    //		if (buffer[iDst - 1] != '\n')
    //		{
    //			buffer[iDst] = '\n';
    //			iDst++;
    //		}

    //		return iDst;
    //	}

    //	/// <summary>Convert the file to Windows format</summary>
    //	/// <param name="content">The source string</param>
    //	/// <param name="buffer">Returns the converted string</param>
    //	/// <param name="count">Returns the number of EOL characters that were converted</param>
    //	/// <returns>Length of the output <paramref name="buffer">buffer</paramref> parameter (0 if failed to convert)</returns>
    //	private int ConvertToWindows(string content, out char[] buffer, out int count)
    //	{
    //		buffer = new char[content.Length * 2];

    //		int iDst, iSrc;
    //		count = 0;
    //		int size = content.Length;
    //		for (iDst = iSrc = 0; iSrc < size; iDst++, iSrc++)
    //		{
    //			if (content[iSrc] == '\r' &&
    //				(iSrc < size - 1 && content[iSrc + 1] != '\n' || iSrc == size - 1) ||
    //				content[iSrc] == '\n' &&
    //				(iSrc > 0 && content[iSrc - 1] != '\r' || iSrc == 0))
    //			{
    //				buffer[iDst] = '\r';
    //				iDst++;
    //				buffer[iDst] = '\n';
    //				count++;
    //			}
    //			else
    //			{
    //				buffer[iDst] = content[iSrc];
    //			}
    //		}

    //		return iDst;
    //	}

    //	/// <summary>Convert the file to Mac format</summary>
    //	/// <param name="content">The source string</param>
    //	/// <param name="buffer">Returns the converted string</param>
    //	/// <param name="start">Return the start index in the buffer of the converted string</param>
    //	/// <param name="count">Returns the number of EOL characters that were converted</param>
    //	/// <returns>Length of the output <paramref name="buffer">buffer</paramref> parameter (0 if failed to convert)</returns>
    //	private int ConvertToMac(string content, out char[] buffer, out int start, out int count)
    //	{
    //		count = 0;
    //		int iLast = content.LastIndexOf('\n');
    //		if (iLast == -1)
    //		{
    //			start = 0;
    //			buffer = null;
    //			return 0;
    //		}

    //		buffer = content.ToCharArray();

    //		int iDst, iSrc;
    //		int size = buffer.Length;
    //		for (iDst = iSrc = iLast; iSrc >= 0; iDst--, iSrc--)
    //		{
    //			if (buffer[iSrc] == '\n')
    //			{
    //				// If it's Windows format (\r\n), skip the \n in the source,
    //				// otherwise it's a Mac format (just \r)
    //				if (iSrc > 0 && buffer[iSrc - 1] == '\r')
    //					iSrc--;
    //				buffer[iDst] = '\r';
    //				count++;
    //			}
    //			else
    //			{
    //				buffer[iDst] = buffer[iSrc];
    //			}
    //		}

    //		start = iDst + 1;
    //		return size - start;      
    //	}    
    //}

    public sealed partial class StripemPackage
    {
        private static DocumentEvents _de = null;
        private static _dispDocumentEvents_DocumentSavedEventHandler _deSavedEvent = null;

        /// <summary>begin tracking solution events</summary>
        private void TrackDocumentEvents()
        {
            //start tracking solution events
            if (_de == null)
            {
                _de = _applicationObject.Events.get_DocumentEvents(null);
            }
            if (_deSavedEvent == null)
            {
                _deSavedEvent = new _dispDocumentEvents_DocumentSavedEventHandler(de_SavedEvent);
                _de.DocumentSaved += _deSavedEvent;
            }
        }

        /// <summary>remove solution event handlers</summary>
        private void ReleaseDocumentEvents()
        {
            //stop tracking solution events
            if (_de != null)
            {
                try
                {
                    if (_deSavedEvent != null)
                    {
                        _de.DocumentSaved -= de_SavedEvent;
                        _deSavedEvent = null;
                    }
                }
                catch
                {
                }
                _de = null;
            }
        }

        /// <summary>File saved in the editor</summary>        
        private void de_SavedEvent(Document doc)
        {
            if (_style == StripemOptions.EolStyle.Disabled || doc == null)
                return;

            //StringHelperTest.HiPerfTimer perfTimer;    
            //perfTimer = new StringHelperTest.HiPerfTimer();   
            //GC.Collect();        
            //perfTimer.Start();

            // If filename filter is enabled
            if (_enableFilenameFilter)
            {
                // Check if the file name matches the filename filter
                //System.Windows.Forms.MessageBox.Show(doc.Name + " match " + _filenameFilter + " = " + Regex.IsMatch(doc.Name, _filenameFilter), "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);
                if (!Regex.IsMatch(doc.Name, _filenameFilter))
                    return;
            }

            StreamReader reader = new StreamReader(doc.FullName);
            string content = reader.ReadToEnd();

            // Don't convert Unicode files
            if (reader.CurrentEncoding.GetType() == System.Text.Encoding.Unicode.GetType() ||
                reader.CurrentEncoding.GetType() == System.Text.Encoding.UTF32.GetType() ||
                reader.CurrentEncoding.GetType() == System.Text.Encoding.BigEndianUnicode.GetType())
            {
                //System.Windows.Forms.MessageBox.Show("Strip'em doesn't support " + reader.CurrentEncoding.EncodingName + " file encoding.", "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);      
                reader.Close();
                return;
            }
            reader.Close();

            char[] buffer = null;
            int length = 0;
            int start = 0;
            int count = 0;

            switch (_style)
            {
                case StripemOptions.EolStyle.Unix:
                    length = ConvertToUnix(content, out buffer, out count);
                    break;
                case StripemOptions.EolStyle.Windows:
                    length = ConvertToWindows(content, out buffer, out count);
                    break;
                case StripemOptions.EolStyle.Mac:
                    length = ConvertToMac(content, out buffer, out start, out count);
                    break;
            }

            if (length > 0)
            {
                var utf8WithBom = new System.Text.UTF8Encoding(true);
                StreamWriter writer = new StreamWriter(doc.FullName, false, utf8WithBom);
                writer.Write(buffer, start, length);
                writer.Close();
            }

            //perfTimer.Stop();
            //string message = "Replaced " + count + " in: " + perfTimer.Duration * 1000 + "ms";
            //System.Windows.Forms.MessageBox.Show(message, "Strip'em", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
        }

        /// <summary>Convert the file to Unix format</summary>
        /// <param name="content">The source string</param>
        /// <param name="buffer">Returns the converted string</param>
        /// <param name="count">Returns the number of EOL characters that were converted</param>
        /// <returns>Length of the output <paramref name="buffer">buffer</paramref> parameter (0 if failed to convert)</returns>
        private int ConvertToUnix(string content, out char[] buffer, out int count)
        {
            count = 0;
            int iFirst = content.IndexOf('\r');
            if (iFirst == -1)
            {
                // Always append a newline at the end of the file
                if (!content.EndsWith("\n"))
                {
                    content += "\n";
                    buffer = content.ToCharArray();
                    return buffer.Length;
                }
                buffer = null;
                return 0;
            }

            buffer = content.ToCharArray();

            int iDst, iSrc;
            int size = buffer.Length;
            for (iDst = iSrc = iFirst; iSrc < size; iDst++, iSrc++)
            {
                if (buffer[iSrc] == '\r')
                {
                    // "\r\n"     -> "\n"
                    // "\r\r\r\n" -> "\n\n\n"

                    // Replace consecutive /r with /n
                    for (; iSrc < size && buffer[iSrc] == '\r'; iSrc++, iDst++)
                    {
                        buffer[iDst] = '\n';
                        count++;
                    }
                    // iDst increases again in the external loop
                    iDst--;

                    // If it's Windows format (\r..\r\n), then skip the \n,
                    // (iSrc increases in the external loop. In Windows iSrc is increased twice to skip the \n)
                    if (buffer[iSrc] != '\n')
                        iSrc--;
                }
                else
                {
                    buffer[iDst] = buffer[iSrc];
                }
            }

            // Always append a newline at the end of the file
            if (buffer[iDst - 1] != '\n')
            {
                buffer[iDst] = '\n';
                iDst++;
            }

            return iDst;
        }

        /// <summary>Convert the file to Windows format</summary>
        /// <param name="content">The source string</param>
        /// <param name="buffer">Returns the converted string</param>
        /// <param name="count">Returns the number of EOL characters that were converted</param>
        /// <returns>Length of the output <paramref name="buffer">buffer</paramref> parameter (0 if failed to convert)</returns>
        private int ConvertToWindows(string content, out char[] buffer, out int count)
        {
            buffer = new char[content.Length * 2];

            int iDst, iSrc;
            count = 0;
            int size = content.Length;
            for (iDst = iSrc = 0; iSrc < size; iDst++, iSrc++)
            {
                if (content[iSrc] == '\r' &&
                    (iSrc < size - 1 && content[iSrc + 1] != '\n' || iSrc == size - 1) ||
                    content[iSrc] == '\n' &&
                    (iSrc > 0 && content[iSrc - 1] != '\r' || iSrc == 0))
                {
                    buffer[iDst] = '\r';
                    iDst++;
                    buffer[iDst] = '\n';
                    count++;
                }
                else
                {
                    buffer[iDst] = content[iSrc];
                }
            }

            return iDst;
        }

        /// <summary>Convert the file to Mac format</summary>
        /// <param name="content">The source string</param>
        /// <param name="buffer">Returns the converted string</param>
        /// <param name="start">Return the start index in the buffer of the converted string</param>
        /// <param name="count">Returns the number of EOL characters that were converted</param>
        /// <returns>Length of the output <paramref name="buffer">buffer</paramref> parameter (0 if failed to convert)</returns>
        private int ConvertToMac(string content, out char[] buffer, out int start, out int count)
        {
            count = 0;
            int iLast = content.LastIndexOf('\n');
            if (iLast == -1)
            {
                start = 0;
                buffer = null;
                return 0;
            }

            buffer = content.ToCharArray();

            int iDst, iSrc;
            int size = buffer.Length;
            for (iDst = iSrc = iLast; iSrc >= 0; iDst--, iSrc--)
            {
                if (buffer[iSrc] == '\n')
                {
                    // If it's Windows format (\r\n), skip the \n in the source,
                    // otherwise it's a Mac format (just \r)
                    if (iSrc > 0 && buffer[iSrc - 1] == '\r')
                        iSrc--;
                    buffer[iDst] = '\r';
                    count++;
                }
                else
                {
                    buffer[iDst] = buffer[iSrc];
                }
            }

            start = iDst + 1;
            return size - start;
        }
    }
}